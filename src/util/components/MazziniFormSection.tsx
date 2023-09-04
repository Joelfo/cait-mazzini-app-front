import { ReactNode } from "react";
import { Stack } from "react-bootstrap";
import { JsxElement } from "typescript";

export type MazziniFormSectionProps = {
    title : string;
    children: ReactNode
}

export const MazziniFormSection = ({ title, children } : MazziniFormSectionProps) => {
    const hrBorderCss = '1px solid rgba(0, 0, 0, 0.25)'
    return (
        <Stack style={{marginTop:'20px'}}>
            <h5>{title}</h5>
            <Stack style={{borderTop: hrBorderCss, padding:'20px 0px'}}>
                {children}
            </Stack>
        </Stack>
    )
}