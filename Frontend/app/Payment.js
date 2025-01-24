import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Image } from "react-native";

const Payments = () => {
  const [personalCards, setPersonalCards] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [isCardModalVisible, setCardModalVisible] = useState(false);
  const [isVoucherModalVisible, setVoucherModalVisible] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState({
    number: "",
    type: "",
    expDate: "",
    cvv: "",
    nickname: "",
  });
  const [voucherCode, setVoucherCode] = useState("");

  const addCard = () => {
    if (newCardDetails.number && newCardDetails.expDate && newCardDetails.cvv && newCardDetails.nickname) {
      const cardType = detectCardType(newCardDetails.number);
      setPersonalCards([
        ...personalCards,
        { ...newCardDetails, type: cardType },
      ]);
      setNewCardDetails({ number: "", type: "", expDate: "", cvv: "", nickname: "" });
      setCardModalVisible(false);
    }
  };

  const detectCardType = (number) => {
    if (number.startsWith("4")) {
      return "Visa";
    } else if (number.startsWith("5")) {
      return "MasterCard";
    }
    return "Unknown";
  };

  const applyVoucher = () => {
    if (voucherCode) {
      alert(`Voucher Code Applied: ${voucherCode}`);
      setVoucherCode("");
      setVoucherModalVisible(false);
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.cardItem}>
      <Text>{item.nickname} - **** {item.number.slice(-4)}</Text>
      {item.type === "Visa" && <Image source={require("../assets/images/visa.png")} style={styles.cardIcon} />}
      {item.type === "MasterCard" && <Image source={require("../assets/images/card.png")} style={styles.cardIcon} />}
    </View>
  );

  const renderVoucher = ({ item }) => (
    <TouchableOpacity style={styles.cardItem} onPress={() => setVoucherModalVisible(true)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Business Section */}
      <Text style={styles.sectionHeader}>Business</Text>
      <TouchableOpacity onPress={() => alert("Add Business Account")} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Business Account</Text>
      </TouchableOpacity>

      {/* Personal Cards Section */}
      <Text style={styles.sectionHeader}>Personal</Text>
      <FlatList
        data={personalCards}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No Personal Cards</Text>}
      />
      <TouchableOpacity onPress={() => setCardModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>

      {/* Vouchers Section */}
      <Text style={styles.sectionHeader}>Vouchers</Text>
      <FlatList
        data={vouchers}
        renderItem={renderVoucher}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No Vouchers</Text>}
      />
      <TouchableOpacity onPress={() => setVouchers([...vouchers, "Enter Voucher Code"])} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Voucher</Text>
      </TouchableOpacity>

      {/* Modal for Adding Card */}
      <Modal visible={isCardModalVisible} transparent animationType="none">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Card Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={newCardDetails.number}
              onChangeText={(text) => setNewCardDetails({ ...newCardDetails, number: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Card Expiry Date (MM/YY)"
              value={newCardDetails.expDate}
              onChangeText={(text) => setNewCardDetails({ ...newCardDetails, expDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={newCardDetails.cvv}
              onChangeText={(text) => setNewCardDetails({ ...newCardDetails, cvv: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Card Nickname"
              value={newCardDetails.nickname}
              onChangeText={(text) => setNewCardDetails({ ...newCardDetails, nickname: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={addCard} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCardModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Voucher Code */}
      <Modal visible={isVoucherModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Voucher Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Voucher Code"
              value={voucherCode}
              onChangeText={(text) => setVoucherCode(text)}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={applyVoucher} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVoucherModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  cardItem: { padding: 15, backgroundColor: "#fff", marginVertical: 5, borderRadius: 5, flexDirection: "row", alignItems: "center" },
  cardIcon: { width: 30, height: 20, marginLeft: 10 },
  addButton: { marginTop: 10, padding: 15, backgroundColor: "#fff", borderRadius: 5, borderWidth: 1, borderColor: "#007bff" },
  addButtonText: { color: "#007bff", textAlign: "center" },
  emptyText: { textAlign: "center", color: "#aaa", marginVertical: 20 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginVertical: 5 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  saveButton: { padding: 10, backgroundColor: "#28a745", borderRadius: 5 },
  saveButtonText: { color: "#fff" },
  cancelButton: { padding: 10, backgroundColor: "#dc3545", borderRadius: 5 },
  cancelButtonText: { color: "#fff" },
});

export default Payments;
