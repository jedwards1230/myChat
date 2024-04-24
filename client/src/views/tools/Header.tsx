import { View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { HeaderWrapper } from "../HeaderWrapper";
import { ToolDialog } from "./[id]/ToolDialog.web";
import { Text } from "@/components/ui/Text";

export function ToolHeader() {
	return (
		<HeaderWrapper>
			<Text>Tools</Text>
			<View className="absolute right-0 z-10 translate-x-full">
				<ToolDialog>
					<Button className="mr-4" variant="outline" size="icon">
						<Icon type="FontAwesome" name="plus" />
					</Button>
				</ToolDialog>
			</View>
		</HeaderWrapper>
	);
}
