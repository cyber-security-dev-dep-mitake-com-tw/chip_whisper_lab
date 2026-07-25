#!/bin/bash

#
# Package Build Script - Phase 4.1
#
# Builds and packages WhisperLab for distribution:
# - macOS .pkg + .dmg (installer)
# - Windows .exe + .msi (backend + frontend packaged)
# - Linux multi-arch Docker + Python wheels
# - Homebrew formula (tap whisperlab/whisperlab)
# - Pipx package (whisperlab)
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $*"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

# Configuration
VERSION="${VERSION:-v0.1.0}"
TARGET_OS="${TARGET_OS:-all}"
BUILD_DIR="${BUILD_DIR:-build}"
DIST_DIR="${DIST_DIR:-dist}"

# Create build directories
mkdir -p "$BUILD_DIR" "$DIST_DIR"

# Function to build macOS packages
build_macos() {
    log_info "Building macOS packages (${VERSION})"
    
    # Build macOS .pkg installer
    log_info "Building macOS .pkg installer..."
    pkgbuild --root ./macos-macos --identifier com.whisperlab.whisperlab --version "$VERSION" --install-location / "${BUILD_DIR}/whisperlab-${VERSION}-macos.pkg"
    
    # Create macOS .dmg disk image
    log_info "Creating macOS .dmg disk image..."
    create-dmg --volname "WhisperLab ${VERSION}" --background ./assets/macos-background.png --icon-size 128 --window-size 800 400 "${DIST_DIR}/WhisperLab-${VERSION}.dmg" "./macos-installer.mpkg" --codesign "-" || {
        log_warn "create-dmg not available, falling back to simple copy"
        cp -r ./macos-installer "${DIST_DIR}/WhisperLab-installer"
    }
    
    # Create Homebrew formula
    log_info "Creating Homebrew formula..."
    ./scripts/brew_formula.rb gen "${BUILD_DIR}/whisperlab.rb"
    
    # Sign packages (requires Apple Developer ID)
    if [[ "${CI}" == "true" ]]; then
        log_info "Signing packages in CI (requires Apple Developer ID)"
        # Note: In CI, you'll need to set up proper signing certificates
        codesign --sign "-" "${BUILD_DIR}/whisperlab-${VERSION}-macos.pkg" || log_warn "Package signing skipped (no certificate)"
    fi
}

# Function to build Windows packages
build_windows() {
    log_info "Building Windows packages (${VERSION})"
    
    # Build Windows executable
    log_info "Building Windows .exe..."
    pyinstaller --onefile --windowed --name whisperlab "backend/main.py"
    cp dist/whisperlab.exe "${BUILD_DIR}/WhisperLab-${VERSION}-windows.exe"
    
    # Build Windows .msi installer
    log_info "Building Windows .msi installer..."
    # Note: WiX required for .msi building
    # wixl --source ./wix/whisperlab.wxs --output "${BUILD_DIR}/whisperlab-${VERSION}-windows.msi"
    log_warn "WiX not configured, .msi build skipped"
    
    # Build Python wheels
    log_info "Building Python wheels..."
    python -m pip wheel --wheel-dir "${BUILD_DIR}/wheels" .
}

# Function to build Linux packages
build_linux() {
    log_info "Building Linux packages (${VERSION})"
    
    # Build Docker multi-arch images
    log_info "Building Docker multi-arch images..."
    docker buildx build --platform linux/amd64,linux/arm64 --tag whisperlab/whisperlab:${VERSION} --push .
    
    # Build Linux Python wheels
    log_info "Building Linux Python wheels..."
    python -m pip wheel --wheel-dir "${BUILD_DIR}/wheels" .
}

# Function to create GitHub Release
create_github_release() {
    log_info "Creating GitHub Release (${VERSION})"
    
    # Collect all artifacts
    local artifacts="${BUILD_DIR}/whisperlab-${VERSION}-macos.pkg"
    artifacts+=" ${BUILD_DIR}/WhisperLab-${VERSION}.dmg"
    artifacts+=" ${BUILD_DIR}/WhisperLab-${VERSION}-windows.exe"
    artifacts+=" ${BUILD_DIR}/whisperlab-${VERSION}-windows.msi 2>/dev/null || true"
    artifacts+=" ${BUILD_DIR}/whisperlab.rb"
    
    # Create release assets
    for artifact in $artifacts; do
        if [[ -f "$artifact" ]]; then
            log_info "Adding artifact: $(basename "$artifact")"
            gh release upload "$VERSION" "$artifact" --clobber
        fi
    done
}

# Main build process
main() {
    log_info "Starting WhisperLab package build (${TARGET_OS})"
    
    case "$TARGET_OS" in
        "macos")
            build_macos
            ;;
        "windows")
            build_windows
            ;;
        "linux")
            build_linux
            ;;
        "all")
            build_macos
            build_windows
            build_linux
            ;;
        *)
            log_error "Unsupported TARGET_OS: $TARGET_OS"
            exit 1
            ;;
    esac
    
    # Create GitHub Release
    if [[ "${CI}" == "true" ]] && command -v gh >/dev/null 2>&1; then
        create_github_release
    else
        log_warn "GitHub CLI not available, skipping release creation"
    fi
    
    log_info "Package build completed successfully!"
    log_info "Artifacts available in: ${DIST_DIR}/"
}

# Execute main function
main "$@"