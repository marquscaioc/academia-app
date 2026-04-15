import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { ChallengeTeam } from "../../hooks/queries/useChallengeTeams";

interface TeamSelectorProps {
  visible: boolean;
  teams: ChallengeTeam[];
  onJoinTeam: (teamId: string) => void;
  onCreateTeam: (name: string) => void;
  onClose: () => void;
}

export function TeamSelector({ visible, teams, onJoinTeam, onCreateTeam, onClose }: TeamSelectorProps) {
  const [newTeamName, setNewTeamName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-lg font-black text-text-primary">Escolher Equipe</Text>
            <Pressable onPress={onClose}>
              <Text className="text-text-muted text-lg">✕</Text>
            </Pressable>
          </View>

          {showCreate ? (
            <View className="gap-4">
              <TextInput
                className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
                placeholder="Nome da equipe"
                placeholderTextColor="#6E6580"
                value={newTeamName}
                onChangeText={setNewTeamName}
              />
              <View className="flex-row gap-3">
                <Pressable onPress={() => setShowCreate(false)} className="flex-1 bg-surface-elevated rounded-2xl py-3.5 items-center">
                  <Text className="text-text-secondary font-bold">Voltar</Text>
                </Pressable>
                <Pressable
                  onPress={() => { if (newTeamName.trim()) onCreateTeam(newTeamName.trim()); }}
                  className="flex-1 bg-violet-500 rounded-2xl py-3.5 items-center"
                >
                  <Text className="text-white font-bold">Criar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <ScrollView>
              {teams.map((team) => (
                <Pressable
                  key={team.id}
                  onPress={() => onJoinTeam(team.id)}
                  className="flex-row items-center justify-between p-4 mb-2 bg-surface-card border border-surface-border rounded-2xl active:bg-surface-hover"
                >
                  <View>
                    <Text className="text-sm font-bold text-text-primary">{team.name}</Text>
                    <Text className="text-[10px] text-text-muted">{team.member_count} membros</Text>
                  </View>
                  <Text className="text-violet-400 font-bold text-xs">Entrar</Text>
                </Pressable>
              ))}

              <Pressable
                onPress={() => setShowCreate(true)}
                className="border border-dashed border-surface-border rounded-2xl py-6 items-center mt-2"
              >
                <Text className="text-violet-400 font-bold text-sm">+ Criar nova equipe</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
