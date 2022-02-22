import pkg from 'mongoose';
const { connect } = pkg;

const connectDatabase = async () => {
     await connect(process.env.DB_URI)
          .then((data) => {
               console.log(`Mongodb connected with server: ${data.connection.host}`);
          });
};

export default connectDatabase;