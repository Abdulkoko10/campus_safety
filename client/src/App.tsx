import React, { useEffect } from "react";
import { getMessaging, getToken, onMessage } from './firebase';


import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";

import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  PeopleAltOutlined,
  ReportProblem,
  ReportProblemOutlined,
  ReportProblemRounded,
  ReportProblemSharp,
  ReportProblemTwoTone,
  StarOutlineRounded,
  VillaOutlined, 
} from '@mui/icons-material'

import dataProvider from "@pankod/refine-simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import routerProvider from "@pankod/refine-react-router-v6";
import axios, { AxiosRequestConfig } from 
"axios";

import { Title, Sider, Layout, Header } from "components/layout";

import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";

import { 
  Login,
  Home,
  Students,
  MyProfile,
  ReportDetails,
  AllReports,
  CreateReport,
  StudentProfile,
  EditReport,
 } from "pages" ;


const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {

  // useEffect(() => {
  //   const messaging = getMessaging();

  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     // TODO: Handle the message...
  //   });
  // }, []);


  const authProvider: AuthProvider = {
    login: async (params) => {
      // Check if it's a Google One Tap login
      if ('credential' in params) {
        const { credential }: CredentialResponse = params;
        const profileObj = credential ? parseJwt(credential) : null;

        if (profileObj) {

          const messaging = getMessaging();
          const deviceToken = await getToken(messaging).catch((error: any) => {
            console.error("Failed to get the device token: ", error);
            // You can handle the error here, for example, show a notification or message to the user
            // Return null or some default value for the device token
            return null;
          });  
          
          const response = await fetch('http://localhost:8080/api/v1/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: profileObj.name,
              email: profileObj.email,
              avatar: profileObj.picture,
              role: 'SecurityStaff', // You are setting the role to 'SecurityStaff' when creating a user with Google One Tap
              deviceToken,
            })
          });

          const data = await response.json();

          if (response.status === 200) {
            localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              _id: data._id,
              role: 'SecurityStaff', // Set the user role to 'SecurityStaff'
              deviceToken
            })
          );
          } else {
            return Promise.reject();
          }
        }

        localStorage.setItem("token", `${credential}`);

        return Promise.resolve();
      } else {
        // Student login
        const { email, password } = params;
        try {

          const messaging = getMessaging();
          const deviceToken = await getToken(messaging).catch((error: any) => {
            console.error("Failed to get the device token: ", error);
            // You can handle the error here, for example, show a notification or message to the user
            // Return null or some default value for the device token
            return null;
          });
          
          const response = await axios.post('http://localhost:8080/api/v1/users/login', {
            email,
            password,
            deviceToken,
          });
          
          if (response.status === 200) {
            const {token, user} = response.data;
            
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ ...user, role: 'Student' })); // Set the user role to 'Student'
         
            
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        } catch (error) {
          return Promise.reject();
        }
      }
    },
    register: async ({ name, email, password, phoneNumber, role }) => {
      try {

        const messaging = getMessaging();
          const deviceToken = await getToken(messaging).catch((error: any) => {
          console.error("Failed to get the device token: ", error);
          // You can handle the error here, for example, show a notification or message to the user
          // Return null or some default value for the device token
          return null;
          });


        const response = await axios.post('http://localhost:8080/api/v1/users/register', {
          name,
          email,
          password,
          phoneNumber,
          role: 'Student',
          deviceToken,
           });
        
        if (response.status === 201) {
          const {token, user} = response.data;
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user, ));
          
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      } catch (error) {
        return Promise.reject();
      }
    },    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };

  return (
      <RefineSnackbarProvider>
        <Refine
          dataProvider={dataProvider("http://localhost:8080/api/v1")}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={[
            {
              name: "reports",
              list: AllReports,
              show: ReportDetails,
              create: CreateReport,
              edit: EditReport,
              icon: <ReportProblemRounded />,
            },
            {
              name: "students",
              list: Students,
              show: StudentProfile,
              icon: <PeopleAltOutlined />,
            },
            {
              name: "reviews",
              list: Home,
              icon: <AccountCircleOutlined />
            },
            // {
            //   name: "messages",
            //   list: Home,
            //   icon: <ChatBubbleOutline />
            // },
            {
              name: "my-profile",
              options: { label: 'My Profile'},
              list: MyProfile,
              icon: <AccountCircleOutlined />
            },
          ]}
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          routerProvider={routerProvider}
          authProvider={authProvider}
          LoginPage={Login}
          DashboardPage={Home}
          />
      </RefineSnackbarProvider>
  );
}

export default App;
