*** Settings ***
Library    Process
Library    OperatingSystem
Resource    ../resources/common.robot
Suite Setup    Set Suite Variable    ${ROOT}    ${EMPTY}

*** Test Cases ***
Hardware Targets Supports Dry Run
    ${result}=    Run Process    ./hardware/driver-validation.sh    --dry-run    --simulator-only    shell=True    cwd=${ROOT}    timeout=60
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    Hardware validation
    Should Contain    ${result.stdout}    DRY RUN

Hardware Targets Supports Sim-Only Flag
    ${result}=    Run Process    ./hardware/driver-validation.sh    --dry-run    --simulator-only    shell=True    cwd=${ROOT}    timeout=60
    Should Contain    ${result.stdout}    simulator

Hardware Targets Supports Help Flag
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./hardware/driver-validation.sh    --help    shell=True    cwd=${root}    timeout=10
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    --simulator-only
    Should Contain    ${result.stdout}    --dry-run
    Should Contain    ${result.stdout}    --validate-hardware

Hardware Targets Support Flash Detection
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./hardware/driver-validation.sh    --dry-run    --simulator-only    shell=True    cwd=${root}    timeout=60
    Should Contain    ${result.stdout}    flash

Firmware Examples Support Download
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./hardware/firmware-validation.sh    download    --simulator-only    shell=True    cwd=${root}    timeout=120
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    Downloading firmware

Firmware Examples Support List
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./hardware/firmware-validation.sh    list    --simulator-only    shell=True    cwd=${root}    timeout=30
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    Available firmware

Firmware Examples Support Install
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./hardware/firmware-validation.sh    install    --simulator-only    shell=True    cwd=${root}    timeout=120
    Should Be Equal As Integers    ${result.rc}    0
    Should Contain    ${result.stdout}    Installing firmware
