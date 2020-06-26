export interface UserDTO {
    id: string;
    name: string;
    gender?: 'male' | 'female' | 'unknown';
}

export interface PhotoDTO {
    id: string;
    name: string;
    url: string;
}

export function createDTO(user: UserDTO) {
    const newPersona = {
        UserInfo: {
            employeeNo: user.id,
            name: user.name,
            userType: 'normal',
            closeDelayEnabled: false,
            Valid: {
                enable: true,
                beginTime: '2020-06-09T15:07:08',
                endTime: '2030-06-09T15:07:08',
                timeType: 'local'
            },
            belongGroup: '',
            password: '',
            doorRight: '1',
            RightPlan: [
                {
                    doorNo: 1,
                    planTemplateNo: '1'
                }
            ],
            maxOpenDoorTime: 0,
            openDoorTime: 0,
            roomNumber: 0,
            floorNumber: 0,
            localUIRight: false,
            gender: user.gender || 'unknown',
            numOfCard: 0,
            numOfFP: 0,
            numOfFace: 0
        }
    };
    return newPersona;
}
