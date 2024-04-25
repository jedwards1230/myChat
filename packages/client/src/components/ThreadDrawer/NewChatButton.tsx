import { Text } from "@/components/ui/Text";
import LinkButton from "./LinkButton";
import { Icon } from "@/components/ui/Icon";

export default function NewChatButton() {
    return (
        <LinkButton href={{ pathname: "/(app)/" }}>
            <Icon
                type="MaterialIcons"
                name="open-in-new"
                size={20}
                className="text-secondary-foreground"
            />
            <Text className="font-medium">New Chat</Text>
        </LinkButton>
    );
}
