import router from "@/router"
import store from "@/store"
import axios from "axios"
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators"

export interface User {
    _id: string
    phone: string
    city: string
    interests: string[]
    job: string
    language: string
    points: number
}

export interface Tokens {
    accessToken: string
    refreshToken: string
}

@Module({ name: "User", store, dynamic: true, namespaced: true })
export default class UserModule extends VuexModule {
    status: "loading" | "success" | "error" | "" = ""
    accessToken = localStorage.getItem("token") || ""
    refreshToken = localStorage.getItem("refreshToken") || ""
    loading = false
    user: User = {
        _id: "",
        phone: "",
        city: "",
        interests: [],
        job: "",
        language: "English",
        points: 0,
    }

    get isLoggedIn() {
        return !!this.accessToken
    }

    get authStatus() {
        return this.status
    }

    @Mutation
    setPoints(newPoints: number) {
        this.user.points = newPoints
    }

    @Mutation
    setPhone(newPhone: string) {
        this.user.phone = newPhone
    }

    @Mutation
    setCity(newCity: string) {
        this.user.city = newCity
    }

    @Mutation
    setInterests(newInterests: string[]) {
        this.user.interests = newInterests
    }

    @Mutation
    setJob(newJob: string) {
        this.user.job = newJob
    }

    @Mutation
    authRequest() {
        this.status = "loading"
    }

    @Mutation
    authSuccess(payload: { tokens: Tokens; user: User }) {
        this.status = "success"
        this.accessToken = payload.tokens.accessToken
        this.refreshToken = payload.tokens.refreshToken
        this.user = payload.user
    }

    @Mutation
    authError() {
        this.status = "error"
    }

    @Mutation
    resetAuth() {
        this.status = ""
        this.accessToken = ""
        this.refreshToken = ""
    }

    @Mutation
    setUser(user: User) {
        this.user = user
    }

    @Mutation
    setLoading(newLoading: boolean) {
        this.loading = newLoading
    }

    @Action
    async doesUserExist(phone: string) {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/user/exists/${phone}`)
            console.log("user for " + phone + "exists: " + !!response.data.data)
            return !!response.data.data
        } catch (error) {
            console.log(error)
        }
    }

    @Action
    async getUser() {
        try {
            this.setLoading(true)
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/user/me`)
            const { data } = response.data
            this.setUser(data.user)
            this.setLoading(false)
        } catch (error) {
            console.log(error)
            this.setLoading(false)
        }
    }

    @Action
    async logout() {
        try {
            this.setLoading(true)
            const response = await axios.delete(`${process.env.VUE_APP_API_URL}/logout`)
            const { data } = response.data
            console.log(data)
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            this.resetAuth()
            delete axios.defaults.headers.common["Authorization"]
            router.push("/")
            this.setLoading(false)
        } catch (error) {
            console.log(error)
            this.setLoading(false)
        }
    }

    @Action
    async updateUser(user: Partial<User>) {
        try {
            console.log("Updating user")
            const body = { user: user }
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/user/update`, body)
            console.log(response)

            this.setCity(response.data.data.user.city)
            this.setInterests(response.data.data.user.interests)
            this.setJob(response.data.data.user.job)
        } catch (error) {
            console.log(error)
        }
    }
}
