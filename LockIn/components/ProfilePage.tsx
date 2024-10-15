import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Profile } from '../types/riot/profileClass'; // Adjust the import path as necessary

const ProfileTable: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableHeader}>Profile Information</Text>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>PUUID</Text>
        <Text style={styles.tableCell}>{profile.puuid}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Game Name</Text>
        <Text style={styles.tableCell}>{profile.gameName}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Tag Line</Text>
        <Text style={styles.tableCell}>{profile.tagLine}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Server</Text>
        <Text style={styles.tableCell}>{profile.server}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Summoner Level</Text>
        <Text style={styles.tableCell}>{profile.summonerLevel}</Text>
      </View>
      <Text style={styles.tableHeader}>Ranks</Text>
      {profile.ranks.map((rank, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{rank.queueType}</Text>
          <Text style={styles.tableCell}>
            {rank.tier} {rank.rank}
          </Text>
        </View>
      ))}
      <Text style={styles.tableHeader}>Mastery</Text>
      {profile.mastery.map((mastery, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{mastery.championName}</Text>
          <Text style={styles.tableCell}>{mastery.championPoints}</Text>
        </View>
      ))}
      <Text style={styles.tableHeader}>Matches</Text>
      {profile.matches.map((match, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{match.championName}</Text>
          <Text style={styles.tableCell}>
            {match.kills}/{match.deaths}/{match.assists}
          </Text>
        </View>
      ))}
    </View>
  );
};

const ProfilePage: React.FC = () => {
  const [server, setServer] = useState('EUW1');
  const [tag, setTag] = useState('ECPU');
  const [name, setName] = useState('Oriol');
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleSubmit = async () => {
    const url = `${process.env.BACKEND_ADDRESS}/riot/findPlayer?server=${server}&tag=${tag}&name=${name}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('RIOT URL:', url); // Log the request URL
      console.log('Server Response:', data); // Log the server response
      Alert.alert('Server Response', JSON.stringify(data));

      // Save the data using Profile class
      const profileData = new Profile(data);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data from server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile Page</Text>
      <View style={styles.inputContainer}>
        <Text>Server:</Text>
        <TextInput
          style={styles.input}
          value={server}
          onChangeText={setServer}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Tag:</Text>
        <TextInput style={styles.input} value={tag} onChangeText={setTag} />
      </View>
      <View style={styles.inputContainer}>
        <Text>Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <Button title="Search" onPress={handleSubmit} />

      {profile && <ProfileTable profile={profile} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
  },
});

export default ProfilePage;
