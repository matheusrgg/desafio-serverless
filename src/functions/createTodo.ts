import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { v4 as uuidv4 } from "uuid";


interface IRequestCreateTodo {
  user_id: String,
  title: String,
  deadline: Date
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const  { userId: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as IRequestCreateTodo;
  
  await document.put({
    TableName: "tbTodos",
    Item: {
      id: uuidv4(), 
      user_id,
      title, 
      done: false,
      deadline: new Date(deadline).toISOString(),
      created_at: new Date().toISOString()
    }
  }).promise();
  
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "TODO criado com sucesso"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}