
import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

// Define the State using MessagesAnnotation which already includes 'messages'
// We can extend this if we need more state fields later (e.g., currentUserId, pageContext)
export const AgentState = MessagesAnnotation;

export type AgentStateType = typeof AgentState.State;
