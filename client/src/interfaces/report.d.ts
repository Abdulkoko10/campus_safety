import { BaseKey } from '@pankod/refine-core';

export interface FormFieldProp {
  title: string,
  labelName: string
}

export interface FormValues {
    title: string,
    description: string,
    reportType: string,
    location: string,
}

export interface ReportCardProps {
  id?: BaseKey | undefined;
  title: string;
  location: string;
  reportType: string;
  photo: string;
  isReviewed?: boolean;
}

