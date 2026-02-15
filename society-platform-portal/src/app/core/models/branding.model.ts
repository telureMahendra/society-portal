export interface SocietyBranding {
    societyId: number;
    name: string;
    subdomain: string;
    logoUrl: string;
    bannerUrl: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        textColor: string;
        backgroundColor: string;
    };
    featureFlags: {
        enableBilling: boolean;
        enableNotices: boolean;
        enableEvents: boolean;
    };
}
