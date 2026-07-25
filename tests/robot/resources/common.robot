*** Settings ***
Library    Process
Library    OperatingSystem
Library    Collections
Library    JSON

*** Keywords ***
Whisperlab Root
    ${root}=    Evaluate    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))    os
    RETURN    ${root}

Run Installer Dry Run
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./scripts/install-macos.sh    --dry-run    --simulator-only    shell=True    cwd=${root}    timeout=60
    Log    ${result.stdout}
    RETURN    ${result}

Run Doctor
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./scripts/doctor-macos.sh    --simulator-only=true    shell=True    cwd=${root}    timeout=30
    Log    ${result.stdout}
    RETURN    ${result}

Run Doctor JSON
    ${root}=    Whisperlab Root
    ${result}=    Run Process    ./scripts/doctor-macos.sh    --json    --simulator-only=true    shell=True    cwd=${root}    timeout=30
    Log    ${result.stdout}
    RETURN    ${result}

Check Command Exists
    [Arguments]    ${cmd}
    ${result}=    Run Process    which    ${cmd}    shell=True    timeout=5
    Should Be Equal As Integers    ${result.rc}    0    Command '${cmd}' not found

Check File Exists
    [Arguments]    ${path}
    File Should Exist    ${path}
