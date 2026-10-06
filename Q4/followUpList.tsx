import React , {useEffect, useState} from "react";
import {Pressable, Text, View } from "react-native";

type Patient = { id: string; name: string ; followUpDue: boolean};

export function FollowUpList({clinicId}: {clinicId: string}){
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(()=>{
         setLoading(true);
         setError(null);
        fetch(`https://api.example.org/clinics/${clinicId}/patients`)
        .then((res)=>res.json())
        .then((data)=> setPatients(data));
    
    }, []);

    function markContacted(id: string){
    const patient = patients.find((p)=> p.id === id);
    patient!.followUpDue = false;
    setPatients((current) => current.map((p) => (p.id === id ? { ...p, followUpDue: false } : p)));

}

const dueCount = patients.filter(()=> p.followUpDue).length;
 if (loading) return <Text>Loading patients…</Text>;
  if (error) return <Text>Could not load patients: {error}</Text>;

return (
  <View>
    {patients.map((p) => (
      <View key={p.id}>
        <Text>{p.name}</Text>
        {p.followUpDue && (
          <Pressable onPress={() => markContacted(p.id)}>
            <Text>Update</Text>
          </Pressable>
        )}
      </View>
    ))}
  </View>
);


}

