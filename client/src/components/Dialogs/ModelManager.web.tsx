import { View } from "react-native";
import { useRef } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/Dialog";
import { useModelStore } from "@/lib/stores/modelStore";
import { Text } from "@/components/ui/Text";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/Select";
import { modelList } from "@/lib/models/models";
import { Model } from "@/lib/models/types";

export function ModelManagerDialog({
	open,
	onClose,
}: {
	open?: boolean;
	onClose?: () => void;
}) {
	const DialogRef = useRef<HTMLElement>(null);

	const { stream, toggleStream } = useModelStore();

	return (
		<Dialog open={open} onOpenChange={onClose} className="w-full">
			<DialogContent
				ref={DialogRef as unknown as React.RefObject<View>}
				className="flex flex-col justify-center w-full text-foreground"
			>
				<DialogTitle className="text-center">Model Manager</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<View>
						<Text>Model</Text>
						<SelectModel container={DialogRef.current} />
					</View>
					<View>
						<Text>Stream</Text>
						<Text>{stream}</Text>
					</View>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}

function SelectModel({ container }: { container: HTMLElement | null }) {
	const { model, setModel } = useModelStore();
	const models = modelList;
	return (
		<Select
			onValueChange={(e) => setModel(e?.value as Model)}
			defaultValue={{ value: model.name, label: model.name }}
		>
			<SelectTrigger>
				<SelectValue
					className="text-sm text-foreground native:text-lg"
					placeholder="Select a model"
				/>
			</SelectTrigger>
			<SelectContent container={container}>
				<SelectGroup>
					{models.map((model) => (
						<SelectItem
							key={model.name}
							label={model.name}
							value={model.name}
							asChild
						>
							<SelectLabel>{model.name}</SelectLabel>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
