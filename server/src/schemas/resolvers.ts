import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js'; 

interface UserInfo {
    username: string;
    }

interface LoginUserInfo {
    email: string;
    password: string;
}


interface CreateUserInfo {
    input:{
      username: string;
      email: string;
      password: string;
      savedBooks: BookInput[];
    }
  }

  interface BookInput {
    authors: [string];
    description: string;
    bookId: string;
    image: string;
    link: string;
    title: string;
}

interface DeleteBook {
    bookId: string;   
}

const resolvers = {
    Query: {
        user: async (_parent: any, { username }: UserInfo) => {
           return User.findOne({ username });
        }, 
        me: async (_parent: any, _args: unknown, context: any) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },       
    },

    Mutation: {
        addUser: async (_parent: any, { input }: CreateUserInfo) => {
            const user = await User.create({ ...input });
          
            const token = signToken(user.username, user.email, user._id);
            console.log("created user: " + user.username);
            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserInfo) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Authentication for user failed.');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Authentication for user failed.');
            }
      
            const token = signToken(user.username, user.email, user._id);
      
            return { token, user };
          },
    
        saveBook: async (_parent: any, { book }: { book: BookInput }, context: any) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book }, },
                    { new: true }
                );
            }
            throw new AuthenticationError("Please log in");
        },
        },
  
        removeBook: async (_parent: any, { bookId }: DeleteBook, context: any) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } }, },
                    { new: true, }
                );
            }
            throw new AuthenticationError("Please log in");
        },
    },
};

export default resolvers;