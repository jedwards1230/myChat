"use client";

import { View } from "react-native";
import { useEffect } from "react";

import { useUserQuery } from "@/hooks/queries/useUserQuery";
import { useConfigStore } from "@/hooks/stores/configStore";
import { Text } from "@/components/ui/Text";
import { useAgentStore } from "@/hooks/stores/agentStore";

import { appwriteClient } from "@/lib/Appwrite";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	return children;
}
