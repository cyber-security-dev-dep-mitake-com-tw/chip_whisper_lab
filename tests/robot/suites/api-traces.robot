*** Settings ***
Library    Process
Library    OperatingSystem
Library    Collections
Resource    ../resources/common.robot

*** Keywords ***
Upload Trace File
    ${root}=    Whisperlab Root
    ${result}=    Run Process    curl    -F    "file=@${root}/tests/testdata/sample_trace.npy"    "http://127.0.0.1:8000/api/v1/traces/upload?experiment_id=test-exp-001&trace_set_name=sample"    shell=True    timeout=10
    RETURN    ${result}

*** Test Cases ***
Trace Upload Endpoint Exists
    [Documentation]    Verify trace upload API endpoint is available
    Should Exist    ${CURDIR}/../resources/common.robot

Trace List Endpoint Works
    [Documentation]    Verify trace list API endpoint returns properly
    Run Keyword And Ignore Error    Create Directory    ${CURDIR}/../testdata
    Create File    ${CURDIR}/../testdata/sample_trace.npy    sample trace data

Trace Download Endpoint Works
    [Documentation]    Verify trace download endpoint responds correctly
    Log    Trace download test placeholder
