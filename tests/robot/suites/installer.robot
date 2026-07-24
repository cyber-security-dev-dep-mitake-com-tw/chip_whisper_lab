*** Settings ***
Library    Process
Library    OperatingSystem
Resource    ../resources/common.robot
Suite Setup    Set Suite Variable    ${ROOT}    ${EMPTY}

*** Test Cases ***
Installer Supports Dry Run
    ${result}=    Run Installer Dry Run
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    WhisperLab Apple Silicon installer
    Should Contain    ${result.stdout}    DRY RUN

Installer Supports Simulator Only Flag
    ${result}=    Run Installer Dry Run
    Should Contain    ${result.stdout}    simulator

Installer Supports Help Flag
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./scripts/install-macos.sh    --help    shell=True    cwd=${root}    timeout=10
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    --simulator-only
    Should Contain    ${result.stdout}    --conda-fallback
    Should Contain    ${result.stdout}    --install-esp32
    Should Contain    ${result.stdout}    --verify-hardware

Install Report File Is Generated
    ${root}=    Whisperlab Root
    ${report}=    Set Variable    ${root}/INSTALL_REPORT.json
    Run Keyword And Ignore Error    Remove File    ${report}
    ${result}=    Run Installer Dry Run
    Should Exist    ${report}
    ${content}=    Get File    ${report}
    Should Contain    ${content}    dry_run
    Should Contain    ${content}    simulator_only
