import { gql } from @apollo/client;

export const GET_ME = gql`
    query singleUser($userProfile: ID!) {
        user(userProfile: $userProfile) {
            username
            email
            password
            savedBooks
        }
    }
`;