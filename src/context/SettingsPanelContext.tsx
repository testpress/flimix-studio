import React, { createContext, useContext, useState } from 'react';

interface SettingsPanelContextType {
	isSettingsOpen: boolean;
	toggleSettings: () => void;
	openSettings: () => void;
	closeSettings: () => void;
}

const SettingsPanelContext = createContext<SettingsPanelContextType | undefined>(undefined);

export const SettingsPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const toggleSettings = () => setIsSettingsOpen(prev => !prev);
	const openSettings = () => setIsSettingsOpen(true);
	const closeSettings = () => setIsSettingsOpen(false);

	return (
		<SettingsPanelContext.Provider value={{ isSettingsOpen, toggleSettings, openSettings, closeSettings }}>
			{children}
		</SettingsPanelContext.Provider>
	);
};

export const useSettingsPanel = (): SettingsPanelContextType => {
	const ctx = useContext(SettingsPanelContext);
	if (!ctx) {
		throw new Error('useSettingsPanel must be used within a SettingsPanelProvider');
	}
	return ctx;
};
