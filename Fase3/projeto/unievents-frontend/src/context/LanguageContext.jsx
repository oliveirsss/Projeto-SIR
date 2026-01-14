import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext({
    language: 'pt',
    setLanguage: () => { },
    t: (key) => key
});

const translations = {
    pt: {
        // Navigation & Common
        welcome: "Olá",
        search_placeholder: "Pesquisar eventos...",
        loading: "A carregar...",
        error: "Ocorreu um erro",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Apagar",
        edit: "Editar",

        // Auth
        login: "Entrar",
        register: "Registar",
        logout: "Sair",
        email: "Email",
        password: "Password",
        name: "Nome",
        create_account: "Criar Conta",
        dont_have_account: "Não tem conta?",
        have_account: "Já tem conta?",

        // Feed
        find_best_events: "Encontra os melhores eventos para ti.",
        no_events: "Nenhum evento encontrado.",
        try_filters: "Tenta mudar os filtros.",

        // Filters
        all: "Todos",
        today: "Hoje",
        sport: "Desporto",
        free: "Gratuito",
        saved: "Inscritos",
        past_events: "Realizados",
        event_ended: "Evento Realizado",
        attendees_count: "pessoas participaram",

        // Create Event
        create_new_event: "Criar Novo Evento",
        title: "Título",
        title_en: "Título (Inglês)",
        category: "Categoria",
        date_time: "Data e Hora",
        location: "Localização",
        description: "Descrição",
        description_en: "Descrição (Inglês)",
        price: "Preço",
        is_free: "Evento Gratuito",
        paid: "Pago",
        upload_cover: "Carregar Capa",
        publishing: "A publicar...",
        publish: "Publicar Evento",
        create_event: "Criar Evento",

        // Categories
        Desporto: "Desporto",
        Cultura: "Cultura",
        Academico: "Académico",
        Outro: "Outro",

        // Details
        people_going: "pessoas vão",
        organized_by: "Organizado por",
        about_event: "Sobre o evento",
        comments: "Comentários",
        add_comment: "Adicionar um comentário...",
        subscribe: "Inscrever-me",
        subscribed: "Inscrito",
        total_price: "Preço total",

        // Profile
        profile_settings: "Definições de Perfil",
        manage_data_preferences: "Gerir dados e preferências",
        change_photo: "Alterar Foto",
        language: "Idioma",
        save_changes: "Guardar Alterações",
        saving: "A guardar...",
        success_update: "Perfil atualizado com sucesso!",
        management: "Gestão",
        admin_panel: "Painel de Admin"
    },
    en: {
        // Navigation & Common
        welcome: "Hello",
        search_placeholder: "Search events...",
        loading: "Loading...",
        error: "An error occurred",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",

        // Auth
        login: "Login",
        register: "Register",
        logout: "Logout",
        email: "Email",
        password: "Password",
        name: "Name",
        create_account: "Create Account",
        dont_have_account: "Don't have an account?",
        have_account: "Already have an account?",

        // Feed
        find_best_events: "Find the best events for you.",
        no_events: "No events found.",
        try_filters: "Try changing filters.",

        // Filters
        all: "All",
        today: "Today",
        sport: "Sport",
        free: "Free",
        saved: "Subscribed",
        past_events: "Past Events",
        event_ended: "Event Ended",
        attendees_count: "people attended",

        // Create Event
        create_new_event: "Create New Event",
        title: "Title",
        title_en: "Title (English)",
        category: "Category",
        date_time: "Date & Time",
        location: "Location",
        description: "Description",
        description_en: "Description (English)",
        price: "Price",
        is_free: "Free Event",
        paid: "Paid",
        upload_cover: "Upload Cover",
        publishing: "Publishing...",
        publish: "Publish Event",

        // Categories
        Desporto: "Sport",
        Cultura: "Culture",
        Academico: "Academic",
        Outro: "Other",

        // Details
        people_going: "people going",
        organized_by: "Organized by",
        about_event: "About the event",
        comments: "Comments",
        add_comment: "Add a comment...",
        subscribe: "Subscribe",
        subscribed: "Subscribed ✓",
        total_price: "Total Price",

        // Profile
        profile_settings: "Profile Settings",
        manage_data_preferences: "Manage data and preferences",
        change_photo: "Change Photo",
        language: "Language",
        save_changes: "Save Changes",
        saving: "Saving...",
        success_update: "Profile updated successfully!",
        management: "Management",
        admin_panel: "Admin Panel"
    }
};

export function LanguageProvider({ children }) {
    // Try to get language from localStorage, default to 'pt'
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('app_language') || 'pt';
    });

    useEffect(() => {
        localStorage.setItem('app_language', language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback or Error, but with default value above, this shouldn't happen unless null is passed explicitly
        return { language: 'pt', setLanguage: () => { }, t: (k) => k };
    }
    return context;
}
