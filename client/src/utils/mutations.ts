import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user
                _id
                username
                savedBooks
            }
        }
    `;

export const ADD_USER = gql`
mutation addUser($input: UserInput!) 
    addUser(input: $input) {
        token
        user {
            _id
            username
            savedBooks
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($userID: ID!, $savedBooks: String!) {
        saveBook(userID: $userID, savedBooks: $savedBooks) {
            _id
            savedBooks
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($savedBooks: String!) {
        removeBook(savedBooks: $savedBooks) {
            _id
            savedBooks
        }
    }
`;