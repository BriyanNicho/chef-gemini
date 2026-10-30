import chefGeminiLogo from "./images/chef-gemini-icon.svg"

export default function Header() {
    return (
        <header>
            <img src={chefGeminiLogo} alt="Chef Gemini logo" />
            <h1>Chef Gemini</h1>
        </header>
    )
}