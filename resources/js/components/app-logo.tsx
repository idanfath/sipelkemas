import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="fill-current text-white dark:text-black" />
            </div>
            <div className="grid flex-1 text-left ">
                <span className=" truncate leading-tight font-semibold">
                    SIPELKEMAS
                </span>
            </div>
        </>
    );
}
