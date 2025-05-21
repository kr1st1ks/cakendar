import { Stack } from "expo-router";
import {EventProvider} from "../../contexts/EventContext";
export default function AuthLayout() {
    return (
    <EventProvider> <Stack /> </EventProvider>
    )
}