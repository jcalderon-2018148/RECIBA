import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import { NotFound } from './pages/NotFound/NotFound'
import { HomePage } from './pages/HomePage/HomePage'
import { LoginPage } from './pages/HomePage/LoginPage'
import { AboutUsPage } from './pages/HomePage/AboutUsPage'
import { MasterDashboard } from './pages/Master/MasterDashboard'
import React, { createContext, useEffect, useState } from 'react'
import { UserHomePage } from './pages/User/UserHomePage'
import { RecyclerDashboard } from './pages/Recycler/RecyclerDashboard'
import { PartnerDashboard } from './pages/Partner/PartnerDashboard'
import { HomeRecycler } from './pages/Recycler/HomeRecycler'
import { RegisterPage } from './pages/HomePage/RegisterPage'
import { RecyclerView } from './pages/User/RecyclerView/RecyclerView'
import { PartnerView } from './pages/User/PartnerView/PartnerView'
import { UserHome } from './pages/User/UserHome'
import { ViewBillMaterials } from './pages/Recycler/ViewBillMaterials'
import { CreateBill } from './pages/Recycler/CreateBill'
import { ViewBills } from './pages/Recycler/ViewBills'
import { ViewMaterials } from './pages/Recycler/ViewMaterials'
import { CreateMaterial } from './pages/Recycler/CreateMaterial'
import { UpdateMaterial } from './pages/Recycler/UpdateMaterial'
import { BillView } from './pages/User/BillView/BillView'
import { RewardView } from './pages/User/RewardView/RewardView'
import { Settings } from './pages/User/Settings'
import { ViewDetails } from './components/bill/ViewDetails'
import { Example } from './pages/Master/Example'
import { UserPage } from './pages/Master/MasterUserView/UserPage'
import { AddUserPage } from './pages/Master/MasterUserView/AddUserPage'
import { UpdateUserPage } from './pages/Master/MasterUserView/UpdateUserPage'
import { MasterRecyclerView } from './pages/Master/MasterRecyclerView/MasterRecyclerView'
import { MasterRecyclerUpdate } from './pages/Master/MasterRecyclerView/MasterRecyclerUpdate'
import { MasterRecyclerAdd } from './pages/Master/MasterRecyclerView/MasterRecyclerAdd'
import { Stats } from './pages/User/stadistics/Stats'
import { RecyclerStats } from './pages/Recycler/Stadistics/RecyclerStats'
import { AddReward } from './pages/Partner/AddReward'
import { ViewReward } from './pages/Partner/ViewReward'
import { EditReward } from './pages/Partner/EditReward'
import { MasterStats } from './pages/Master/Stadistics/MasterStats'
import { RewardStats } from './pages/Partner/Stadistics/RewardStats'
import { ViewPartner } from './pages/Master/MasterPartnerView/ViewPartner'
import { UpdatePartner } from './pages/Master/MasterPartnerView/UpdatePartner'
import { AddPartner } from './pages/Master/MasterPartnerView/AddPartner'
import { MasterUpdateReward } from './pages/Master/MasterRewardView/MasterUpdateReward'
import { RangesView } from './pages/Master/Ranges/RangesView'
import { ModalAddRange } from './components/ranges/ModalAddRange'
import { AddReward2 } from './pages/Partner/AddReward2'

export const AuthContext = createContext()

export const Index = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [dataUser, setDataUser] = useState()

    useEffect(() => {
        let token = localStorage.getItem('token')
        let user = localStorage.getItem('user')

        token ? setLoggedIn(true) : setLoggedIn(false)
        if (user) setDataUser(JSON.parse(user))
    }, [])

    const routes = createBrowserRouter([
        {
            path: '/',
            element: <App />,
            errorElement: <NotFound/>,
            children: [
                {
                    path: '/',
                    element: <HomePage/>
                },
                {
                    path: '/about',
                    element: <AboutUsPage/>
                },
                {
                    path: '/register',
                    element: <RegisterPage/>
                },
                {
                    path: '/login',
                    element: <LoginPage/>
                },
                {
                    path: '/master',
                    element: loggedIn ? (dataUser?.role === 'MASTER' ? <MasterDashboard/> : <NotFound/>) : (<LoginPage/>),
                    children: [
                        {
                            path: 'page',
                            element: <UserHome />
                        },
                        {
                            path: 'users',
                            element: <UserPage/>
                        },
                        {
                            path: 'addUser',
                            element: <AddUserPage/>
                        },
                        {
                            path: 'updateUser/:id',
                            element: <UpdateUserPage/>
                        },
                        {
                            path: 'recyclerview',
                            element: <MasterRecyclerView/>
                        },
                        {
                            path: 'addRecycler',
                            element: <MasterRecyclerAdd/>
                        },
                        {
                            path: 'updateRecycler/:id',
                            element: <MasterRecyclerUpdate/>
                        },
                        {
                            path: 'recyclerview/:id',
                            element: <RecyclerView/>
                        },
                        {
                            path: 'stats',
                            element: <MasterStats/>
                        },
                        {
                            path: 'partnerView',
                            element: <ViewPartner/>
                        },
                        {
                            path: 'addPartner',
                            element: <AddPartner/>
                        },
                        {
                            path: 'updatePartner/:id',
                            element: <UpdatePartner/>
                        },
                        {
                            path: 'partnerview/:id',
                            element: <PartnerView/>
                        },
                        {
                            path:'addReward/:id',
                            element:<AddReward/>
                        },{
                            path: 'updateReward/:id',
                            element: <MasterUpdateReward/>
                        },
                        {
                            path: 'settings',
                            element: <Settings/>
                        },
                        {
                            path: 'rangeView',
                            element: <RangesView/>
                        },
                        {
                            path: 'addRange',
                            element: <ModalAddRange/>
                        }
                    ]
                },
                {
                    path: '/home',
                    element: loggedIn ? (dataUser?.role === 'CLIENT' ? <UserHomePage/> : <NotFound/>) : (<LoginPage/>),
                    children: [
                        {
                            path: 'page',
                            element: <UserHome/>
                        },
                        {
                            path: 'recyclerview/:id',
                            element: <RecyclerView/>
                        },
                        {
                            path: 'partnerview/:id',
                            element: <PartnerView/>
                        },
                        {
                            path: 'bills',
                            element: <BillView/>
                        },
                        {
                            path: 'claimers',
                            element: <RewardView/>
                        },
                        {
                            path: 'settings',
                            element: <Settings/>
                        },
                        {
                            path: 'viewDetails/:id',
                            element: <ViewDetails/>
                        },
                        {
                            path: 'stats',
                            element: <Stats/>
                        }
                    ]
                },
                {
                    path: '/recycler',
                    element: loggedIn ? (dataUser?.role === 'RECYCLER' ? <RecyclerDashboard/> : <NotFound/>) : (<LoginPage/>),
                    children: [
                        {
                            path: 'home',
                            element: <HomeRecycler/>,
                        },
                        {
                            path: 'viewMaterials',
                            element: <ViewMaterials/>
                        },
                        {
                            path: 'createMaterial',
                            element: <CreateMaterial/>
                        },
                        {
                            path: 'updateMaterial/:id',
                            element: <UpdateMaterial/>
                        },
                        {
                            path: 'createBill',
                            element: <CreateBill/>
                        },
                        {
                            path: 'viewBills',
                            element: <ViewBills/>
                        },
                        {
                            path: 'viewBillMaterials/:id',
                            element: <ViewBillMaterials/>
                        },
                        {
                            path: 'stats',
                            element: <RecyclerStats/>
                        },
                        {
                            path: 'settings',
                            element: <Settings/>
                        },
                    ]
                },
                {
                    path: '/partner',
                    element: loggedIn ? (dataUser?.role === 'PARTNER' ? <PartnerDashboard /> : <NotFound />) : (<LoginPage />),
                    children: [
                        {
                            path:'addReward',
                            element:<AddReward2/>
                        },
                        {
                            path:'viewReward',
                            element:<ViewReward/>
                        },
                        {
                            path:'editReward/:id',
                            element:<EditReward/>
                        },
                        {
                            path:'rewardStats',
                            element:<RewardStats/>
                        },
                        {
                            path: 'settings',
                            element: <Settings/>
                        },
                    ]
                }
            ]
        }
    ])

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, dataUser, setDataUser }}>
            <RouterProvider router={routes} />
        </AuthContext.Provider>
    )

}