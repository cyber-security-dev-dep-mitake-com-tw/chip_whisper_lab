*** Settings ***
Suite Setup    Set Suite Variable    ${ROOT}    ${EMPTY}

*** Test Cases ***
Run All Installer Tests
    Run Tests    ${ROOT}/tests/robot/suites/installer.robot

Run All Doctor Tests
    Run Tests    ${ROOT}/tests/robot/suites/doctor.robot
