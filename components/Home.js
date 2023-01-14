import { Avatar, Card, Title, Paragraph } from "react-native-paper";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const LeftContent = (props) => <Avatar.Icon {...props} icon="bike-fast" />;
export default function Home() {
  return (
    <Card style={styles.cardContainer}>
      <Card.Title title="Hamilton City Bikes" left={LeftContent} />
      <Card.Cover
        source={ require('../assets/bike-QR-Code.jpg')}
      />
      <ScrollView>
        <Card.Content>
          <Title>Welcome to City Bikes!</Title>
          <Paragraph>
            Hamilton Bike Share may get more bicycles to add to the fleet if
            City Council approves spending $50,000 to ship the bicycles from
            Portland.
          </Paragraph>
          <Paragraph>
            The bikes were used by Portland’s bike share system before an
            upgrade last year when Portland switched providers and replaced
            their entire fleet with electric-assist bicycles.
          </Paragraph>
          <Paragraph>
            Over the years, Hamilton Bike Share has ordered 900 bicycles, some
            of which are no longer in the fleet.
          </Paragraph>
          <Paragraph>
            The hope is to get 600 of the used bicycles from Portland, and add
            the best of them to the Hamilton fleet.
          </Paragraph>
          <Paragraph>
            “It is a great opportunity for enhancing the system and reducing
            waste by collaborating with another city,” says Hamilton Bike Share
            Inc Executive Director Chelsea Cox.
          </Paragraph>
        </Card.Content>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "#cde",
    alignItems: "center",
    justifyContent: "center",
  },
});
