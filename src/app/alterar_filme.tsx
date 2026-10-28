import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function AlterarFilme() {
    const [id, setId] = useState('');
    const [titulo, setTitulo] = useState('');
    const [ano, setAno] = useState('');
    const [genero, setGenero] = useState('');
    const [diretor, setDiretor] = useState('');

    const idParam = useLocalSearchParams<


    return (

        <View style={styles.container}>
            <View style={styles.view_campo}>
                <Text>
                    ID do Filme:
                </Text>
                <TextInput
                    value={id}
                    onChangeText={setId}
                />

            </View>

            <View style={styles.view_campo}>
                <Text>
                    Nome do Filme:
                </Text>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                />

            </View>

            <View style={styles.view_campo}>
                <Text>
                    Ano do Filme:
                </Text>
                <TextInput
                    value={ano}
                    onChangeText={setAno}
                />

            </View>

            <View style={styles.view_campo}>
                <Text>
                    Gênero do Filme:
                </Text>
                <TextInput
                    value={genero}
                    onChangeText={setGenero}
                />

            </View>

            <View style={styles.view_campo}>
                <Text>
                    Diretor do Filme:
                </Text>
                <TextInput
                    value={diretor}
                    onChangeText={setDiretor}
                />


            </View>


        </View>
    )

}

const styles = StyleSheet.create<any>({
    container: {
        flex: 1,
        backgroundColor: '#090d16',
    },
    view_campo: {
        margin: 10,
    }
});
