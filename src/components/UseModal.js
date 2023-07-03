import { useState } from "react";

export default function UseModal() {
    const [visible, setVisible] = useState(false);

    function toggle() {
        setVisible(!visible);
    }

    return {
        visible,
        toggle,
    };
}