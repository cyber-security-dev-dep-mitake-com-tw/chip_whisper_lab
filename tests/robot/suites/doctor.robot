*** Settings ***
Library    Process
Library    OperatingSystem
Library    Collections
Resource    ../resources/common.robot

*** Test Cases ***
Doctor Exits Successfully
    ${result}=    Run Doctor
    Should Be Equal As Integers    ${result.rc}    0

Doctor Reports Architecture
    ${result}=    Run Doctor
    Should Contain    ${result.stdout}    architecture
    Should Contain    ${result.stdout}    arm64

Doctor Checks Homebrew
    ${result}=    Run Doctor
    Should Contain    ${result.stdout}    Homebrew

Doctor Checks Python
    ${result}=    Run Doctor
    Should Contain    ${result.stdout}    Python

Doctor JSON Output Is Valid
    ${result}=    Run Doctor JSON
    Should Be Equal As Integers    ${result.rc}    0
    ${json}=    Evaluate    json.loads('''${result.stdout}''')    json
    Dictionary Should Contain Key    ${json}    macos
    Dictionary Should Contain Key    ${json}    arch
    Dictionary Should Contain Key    ${json}    simulator_only
    Dictionary Should Contain Key    ${json}    failures
    Dictionary Should Contain Key    ${json}    warnings
    Dictionary Should Contain Key    ${json}    checks
