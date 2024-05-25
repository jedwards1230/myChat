import { View } from "react-native";

import { Button } from "~/native/Button";
import { Icon } from "~/native/Icon";
import { HeaderWrapper } from "../HeaderWrapper";
import { ToolDialog } from "./[id]/ToolDialog.web";

export function ToolHeader() {
	return (
		<HeaderWrapper title="Tools">
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
