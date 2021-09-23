import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Login , Loading, Register} from '../../screens'

export default function LoginStack() {
    let LoginStack = createNativeStackNavigator()
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen name="photogram.loading.screen" component={Loading} />
            <LoginStack.Screen name="photogram.login.screen" component={Login} />
            <LoginStack.Screen name="photogram.register.screen" component={Register} />
        </LoginStack.Navigator>
    )
}
