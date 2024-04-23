import { Link, type Href } from "expo-router";
import { Pressable } from "react-native";

import { cn } from "@/lib/utils";
import { TextClassContext } from "../ui/Text";

type PathNameProps = { pathname: string };

interface LinkButtonProps<T extends PathNameProps> {
    href: Href<T>;
    children?: React.ReactNode;
    className?: string;
    active?: boolean;
}

export default function LinkButton<T extends PathNameProps>({
    href,
    children,
    className,
    active,
}: LinkButtonProps<T>) {
    return (
        <TextClassContext.Provider
            value={
                "web:whitespace-nowrap text-sm native:text-base group-aria-selected:text-background text-foreground transition-colors text-secondary-foreground"
            }
        >
            <Link asChild href={href} className={cn("w-full", className)}>
                <Pressable
                    role="tab"
                    aria-selected={active}
                    className="flex flex-row items-center justify-between w-full h-10 gap-2 p-2 transition-colors rounded-md group web:ring-offset-background aria-selected:bg-primary web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 bg-secondary hover:bg-secondary-foreground/10 dark:hover:bg-secondary-foreground/50 active:opacity-90 web:justify-start"
                >
                    {children}
                </Pressable>
            </Link>
        </TextClassContext.Provider>
    );
}
