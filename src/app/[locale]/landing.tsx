"use client"
import { useThemeContext } from "@/themes/ThemeProvider";
import { Button, Label, Switch, SwitchOnChangeData } from "@fluentui/react-components";
import { useTranslations } from "next-intl";
import React from "react";

const Landing = () => {
    const t = useTranslations('LandingPage');
    const { theme, setTheme } = useThemeContext();

    const onChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) => {
        setTheme(data.checked ? 'dark' : 'light');
    },
        [setTheme]
    );

    return (
        <div className="flex-col">
            <div>
                {t('title')}
                <Switch
                    checked={theme === 'dark'}
                    onChange={onChange}
                    label={theme === 'dark' ? "Dark Theme" : "Light Theme"}
                />
            </div>
            <Button >
                <Label size="small">{t('gotoLogin')}</Label>
            </Button>
        </div>
    )
}

export default Landing