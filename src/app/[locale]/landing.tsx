"use client"
import { useThemeContext } from "@/themes/ThemeProvider";
import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

const Landing = () => {
    const t = useTranslations('LandingPage');
    const { theme, setTheme } = useThemeContext();

    return (
        <div className="flex-col">
            <div>
                {t('title')}
            </div>
            <Button variant="contained" >
                <Typography>{t('gotoLogin')}</Typography>
            </Button>
        </div>
    )
}

export default Landing