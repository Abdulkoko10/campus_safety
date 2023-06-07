import { BaseKey } from '@pankod/refine-core';

export interface StudentCardProp {
    id?: BaseKey | undefined,
    name: string,
    email: string,
    avatar: string,
    phoneNumber: string,
    noOfReports: number
}

export interface InfoBarProps {
    icon: ReactNode,
    name: string
}
