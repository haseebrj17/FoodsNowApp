import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { View, Text } from "react-native";

const BottomSheet = () => {
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["48%"];
    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
    }
    return (
        <BottomSheetModal
        ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
            >
                <View>
                    <Text>
                        Hello
                    </Text>
                </View>
            </BottomSheetModal>
    )
}

export default BottomSheet