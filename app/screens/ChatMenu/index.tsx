// app/screens/ChatMenu/index.tsx
import Drawer from '@components/views/Drawer'
import HeaderButton from '@components/views/HeaderButton'
import HeaderTitle from '@components/views/HeaderTitle'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'
import ChatInput from '@screens/ChatMenu/ChatInput'
import AvatarViewer from '@screens/ChatMenu/ChatWindow/AvatarViewer'
import ChatWindow from '@screens/ChatMenu/ChatWindow/ChatWindow'
import ChatsDrawer from '@screens/ChatMenu/ChatsDrawer'
import OptionsMenu from '@screens/ChatMenu/OptionsMenu'
import SettingsDrawer from '@screens/SettingsDrawer'
import { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Picker } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { discoverPeers, Peer } from '../../../lib/swarm'
import { sendPrompt } from '../../../lib/tcp-client'

const ChatMenu = () => {
    const { spacing, color } = Theme.useTheme()
    const { unloadCharacter } = Characters.useCharacterCard(
        useShallow((state) => ({
            unloadCharacter: state.unloadCard,
        }))
    )
    const { chat, unloadChat } = Chats.useChat()
    const { showSettings, showChats } = Drawer.useDrawerState((state) => ({
        showSettings: state.values?.[Drawer.ID.SETTINGS],
        showChats: state.values?.[Drawer.ID.CHATLIST],
    }))

    // Swarm peer state
    const [peers, setPeers] = useState<Peer[]>([])
    const [selectedPeer, setSelectedPeer] = useState('')

    useEffect(() => {
        discoverPeers().then(setPeers) // Load mock peers on mount
        return () => {
            unloadCharacter()
            unloadChat()
        }
    }, [unloadCharacter, unloadChat])

    const sendTestPrompt = async (prompt: string) => {
        const peer = peers.find(p => p.ip === selectedPeer)
        if (peer && prompt) {
            try {
                const output = await sendPrompt(peer.model, prompt)
                console.log(`TCP Response: ${output}`)
            } catch (error) {
                console.log(`TCP Error: ${error.message}`)
            }
        }
    }

    return (
        <Drawer.Gesture
            config={[
                { drawerID: Drawer.ID.CHATLIST, openDirection: 'left', closeDirection: 'right' },
                { drawerID: Drawer.ID.SETTINGS, openDirection: 'right', closeDirection: 'left' },
            ]}>
            <SafeAreaView
                style={{
                    flex: 1,
                    flexDirection: 'row',
                }}>
                <HeaderTitle />
                <HeaderButton
                    headerLeft={() => !showChats && <Drawer.Button drawerID={Drawer.ID.SETTINGS} />}
                    headerRight={() =>
                        !showSettings && (
                            <Drawer.Button drawerID={Drawer.ID.CHATLIST} openIcon="message1" />
                        )
                    }
                />

                <View style={{ flex: 1 }}>
                    {chat && <ChatWindow />}
                    <View
                        style={{
                            marginVertical: spacing.m,
                            paddingHorizontal: spacing.l',
                        }}>
                        {/* Swarm Peer Selection */}
                        <Text
                            style={{
                                color: color.text._default,
                                marginBottom: spacing.s,
                            }}>
                            Select Swarm Peer
                        </Text>
                        <Picker
                            selectedValue={selectedPeer}
                            onValueChange={(itemValue) => setSelectedPeer(itemValue)}
                            style={{
                                color: color.text._900,
                                marginBottom: spacing.s,
                            }}>
                            <Picker.Item label="Select a peer" value="" />
                            {peers.map(peer => (
                                <Picker.Item
                                    key={peer.ip}
                                    label={`${peer.model} (${peer.ip})`}
                                    value={peer.ip}
                                />
                            ))}
                        </Picker>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: spacing.s,
                            }}>
                                {' '}
                            <AvatarViewer />
                            <OptionsMenu />
                            <ChatInput
                                onSend={(message: string) => {
                                    sendTestPrompt(message) // Send message via TCP for testing
                                }}
                            />
                        </View>
                    </View>
                </View>

                <ChatsDrawer />
                <SettingsDrawer />
            </SafeAreaView>
        </Drawer.Gesture>
    )
}

export default ChatMenu
