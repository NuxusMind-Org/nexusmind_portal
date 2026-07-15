import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      common: {
        dashboard: "Dashboard",
        patientsList: "Patients List",
        therapySessions: "Therapy Sessions",
        startNextSession: "Start Next Session",
        searchPlaceholder: "Search patients, sessions...",
        helpCenter: "Help Center",
        logout: "Log Out"
      },
      dashboard: {
        goodMorning: "Good morning, {{name}}",
        clinicalOverview: "Here is your clinical overview for today.",
        todaysSessions: "Today's Sessions",
        moreThanYesterday: "2 more than yesterday",
        weeklySessions: "Weekly Sessions",
        moreThanLastWeek: "4 more than last week",
        monthlySessions: "Monthly Sessions",
        moreThanLastMonth: "10 more than last month",
        publishedBlogs: "Published Blogs",
        readLatestBlogs: "Read latest clinical posts",
        currentDateTime: "Current Date & Time",
        todaysSchedule: "Today's Schedule",
        viewFullCalendar: "View Full Calendar",
        completed: "Completed",
        sessionActive: "Session Active",
        waiting: "Waiting",
        endSession: "End Session",
        joinRoom: "Join Room",
        reviewFile: "Review File",
        activePatients: "Active Patients",
        lastSession: "last session: {{time}}",
        highPriority: "high priority",
        nextTomorrow: "next: tomorrow",
        viewAllPatients: "View All Patients",
        blogsNotification: "Opening latest clinical research & blog directory...",
        personalNotes: "Personal Notes",
        addNotePlaceholder: "Add a quick note...",
        clearAllNotes: "Clear All Notes"
      },
      patients: {
        directory: "Patients Directory",
        subtitle: "Manage and monitor your active caseload, diagnosis tags, and clinical mood metrics.",
        addPatient: "Add Patient",
        totalCaseActive: "Total Case Active",
        highPriority: "High Priority",
        needNotesToday: "Need Notes Today",
        completedWeekly: "Completed Weekly",
        searchBarPlaceholder: "Search by name or diagnosis...",
        priorityLabel: "Priority:",
        allCaseload: "All Caseload",
        highPriorityFilter: "High Priority",
        mediumPriority: "Medium Priority",
        normalPriority: "Normal Priority",
        viewProfile: "View Profile",
        moodIndicator: "Mood Indicator",
        lastSessionLabel: "Last Session",
        nextSessionLabel: "Next Session",
        noPatients: "No patients match your search criteria.",
        clearFilters: "Try clearing your filters or checking spelling."
      },
      sessions: {
        directory: "Therapy Sessions",
        subtitle: "Review appointments, synchronize calendars, join virtual telehealth clinics, and complete SOAP summary logs.",
        todayLoad: "Today's Sessions",
        weekLoad: "This Week's Load",
        monthLoad: "Monthly Total",
        todayTab: "Today",
        weekTab: "This Week",
        monthTab: "This Month",
        joinRoom: "Join Room",
        reviewSummary: "Review Summary",
        details: "Details",
        noSessions: "No scheduled sessions in this date range."
      },
      nav: {
        seoManagement: "SEO"
      },
      auth: {
        signIn: "Sign in",
        emailLabel: "Email",
        passwordLabel: "Password",
        passwordPlaceholder: "At least 8 characters",
        forgotPassword: "FORGOT PASSWORD ?",
        noAccount: "Don't have an account ?",
        signUp: "Sign up",
        emailPlaceholder: "xxxxxxxxxx"
      }
    }
  },
  az: {
    translation: {
      common: {
        dashboard: "Panel",
        patientsList: "Pasiyent Siyahısı",
        therapySessions: "Terapiya Sessiyaları",
        startNextSession: "Növbəti Sessiyanı Başlat",
        searchPlaceholder: "Pasiyentləri, sessiyaları axtarın...",
        helpCenter: "Yardım Mərkəzi",
        logout: "Çıxış"
      },
      dashboard: {
        goodMorning: "Sabahınız xeyir, {{name}}",
        clinicalOverview: "Bu gün üçün kliniki icmalınız.",
        todaysSessions: "Bu günkü sessiyalar",
        moreThanYesterday: "dünənkindən 2 çox",
        weeklySessions: "Həftəlik Sessiyalar",
        moreThanLastWeek: "ötən həftədən 4 çox",
        monthlySessions: "Aylıq Sessiyalar",
        moreThanLastMonth: "ötən aydan 10 çox",
        publishedBlogs: "Dərc Olunmuş Bloqlar",
        readLatestBlogs: "Son kliniki yazıları oxu",
        currentDateTime: "Cari Tarix və Saat",
        todaysSchedule: "Bu günkü cədvəl",
        viewFullCalendar: "Tam Təqvimi Göstər",
        completed: "Tamamlandı",
        sessionActive: "Sessiya Aktivdir",
        waiting: "Gözləyir",
        endSession: "Sessiyanı Bitir",
        joinRoom: "Otağa Qoşul",
        reviewFile: "Faylı İncələ",
        activePatients: "Aktiv Pasiyentlər",
        lastSession: "son sessiya: {{time}}",
        highPriority: "yüksək prioritet",
        nextTomorrow: "növbəti: sabah",
        viewAllPatients: "Bütün Pasiyentləri Göstər",
        blogsNotification: "Son kliniki araşdırmalar və bloq kataloqu açılır...",
        personalNotes: "Şəxsi Qeydlər",
        addNotePlaceholder: "Tez bir qeyd yazın...",
        clearAllNotes: "Bütün Qeydləri Sil"
      },
      patients: {
        directory: "Pasiyent Kataloqu",
        subtitle: "Aktiv pasiyentlərinizi, diaqnoz teqlərini və kliniki əhval-ruhiyyə göstəricilərini idarə edin və izləyin.",
        addPatient: "Pasiyent Əlavə Et",
        totalCaseActive: "Cəmi Aktiv Pasiyent",
        highPriority: "Yüksək Prioritet",
        needNotesToday: "Bu Gün Qeyd Tələb Edilir",
        completedWeekly: "Həftəlik Tamamlanan",
        searchBarPlaceholder: "Ad və ya diaqnoza görə axtar...",
        priorityLabel: "Prioritet:",
        allCaseload: "Bütün Pasiyentlər",
        highPriorityFilter: "Yüksək Prioritet",
        mediumPriority: "Orta Prioritet",
        normalPriority: "Normal Prioritet",
        viewProfile: "Profilə Bax",
        moodIndicator: "Əhval Göstəricisi",
        lastSessionLabel: "Son Sessiya",
        nextSessionLabel: "Növbəti Sessiya",
        noPatients: "Axtarış kriteriyalarınıza uyğun pasiyent tapılmadı.",
        clearFilters: "Filtrləri təmizləməyi və ya yazılışı yoxlamağı sınayın."
      },
      sessions: {
        directory: "Terapiya Sessiyaları",
        subtitle: "Görüşləri nəzərdən keçirin, təqvimləri sinxronlaşdırın, virtual telehealth klinikalarına qoşulun və SOAP qeydlərini tamamlayın.",
        todayLoad: "Bugünkü Sessiyalar",
        weekLoad: "Bu Həftəki Yük",
        monthLoad: "Aylıq Cəmi",
        todayTab: "Bu gün",
        weekTab: "Bu Həftə",
        monthTab: "Bu Ay",
        joinRoom: "Otağa Qoşul",
        reviewSummary: "Xülasəyə Bax",
        details: "Ətraflı",
        noSessions: "Bu tarix aralığında planlaşdırılmış sessiya yoxdur."
      },
      nav: {
        seoManagement: "SEO"
      },
      auth: {
        signIn: "Daxil ol",
        emailLabel: "E-poçt",
        passwordLabel: "Şifrə",
        passwordPlaceholder: "Ən az 8 simvol",
        forgotPassword: "ŞİFRƏNİ UNUTMUSAN ?",
        noAccount: "Hesabın yoxdur ?",
        signUp: "Qeydiyyatdan keç",
        emailPlaceholder: "xxxxxxxxxx"
      }
    }
  },
  ru: {
    translation: {
      common: {
        dashboard: "Панель управления",
        patientsList: "Список пациентов",
        therapySessions: "Терапевтические сессии",
        startNextSession: "Начать следующую сессию",
        searchPlaceholder: "Поиск пациентов, сессий...",
        helpCenter: "Справка",
        logout: "Выйти"
      },
      dashboard: {
        goodMorning: "Доброе утро, {{name}}",
        clinicalOverview: "Ваш клинический обзор на сегодня.",
        todaysSessions: "Сегодняшние сессии",
        moreThanYesterday: "на 2 больше, чем вчера",
        weeklySessions: "Сессии на неделю",
        moreThanLastWeek: "на 4 больше, чем на прошлой неделе",
        monthlySessions: "Сессии на месяц",
        moreThanLastMonth: "на 10 больше, чем в прошлом месяце",
        publishedBlogs: "Опубликованные блоги",
        readLatestBlogs: "Читать последние клинические статьи",
        currentDateTime: "Текущие дата и время",
        todaysSchedule: "Сегодняшнее расписание",
        viewFullCalendar: "Посмотреть весь календарь",
        completed: "Завершено",
        sessionActive: "Сессия активна",
        waiting: "Ожидание",
        endSession: "Завершить сессию",
        joinRoom: "Войти в кабинет",
        reviewFile: "Открыть карту",
        activePatients: "Активные пациенты",
        lastSession: "последняя сессия: {{time}}",
        highPriority: "высокий приоритет",
        nextTomorrow: "следующая: завтра",
        viewAllPatients: "Показать всех пациентов",
        blogsNotification: "Открытие каталога клинических исследований и блогов...",
        personalNotes: "Личные заметки",
        addNotePlaceholder: "Добавить быструю заметку...",
        clearAllNotes: "Очистить все заметки"
      },
      patients: {
        directory: "Справочник пациентов",
        subtitle: "Управляйте и контролируйте список активных пациентов, диагностические теги и показатели настроения.",
        addPatient: "Добавить пациента",
        totalCaseActive: "Всего активных дел",
        highPriority: "Высокий приоритет",
        needNotesToday: "Нужны записи сегодня",
        completedWeekly: "Завершено за неделю",
        searchBarPlaceholder: "Поиск по имени или диагнозу...",
        priorityLabel: "Приоритет:",
        allCaseload: "Все пациенты",
        highPriorityFilter: "Высокий приоритет",
        mediumPriority: "Средний приоритет",
        normalPriority: "Обычный приоритет",
        viewProfile: "Профиль",
        moodIndicator: "Индикатор настроения",
        lastSessionLabel: "Последний сеанс",
        nextSessionLabel: "Следующий сеанс",
        noPatients: "Пациенты, соответствующие критериям поиска, не найдены.",
        clearFilters: "Попробуйте сбросить фильтры или проверить написание."
      },
      sessions: {
        directory: "Терапевтические сессии",
        subtitle: "Просматривайте встречи, синхронизируйте календари, подключайтесь к виртуальным телемедицинским кабинетам и заполняйте отчеты SOAP.",
        todayLoad: "Сессии на сегодня",
        weekLoad: "Нагрузка на неделю",
        monthLoad: "Всего за месяц",
        todayTab: "Сегодня",
        weekTab: "На этой неделе",
        monthTab: "В этом месяце",
        joinRoom: "Войти в кабинет",
        reviewSummary: "Посмотреть резюме",
        details: "Детали",
        noSessions: "Нет запланированных сессий в данном диапазоне дат."
      },
      nav: {
        seoManagement: "SEO"
      },
      auth: {
        signIn: "Войти",
        emailLabel: "Электронная почта",
        passwordLabel: "Пароль",
        passwordPlaceholder: "Не менее 8 символов",
        forgotPassword: "ЗАБЫЛИ ПАРОЛЬ ?",
        noAccount: "Нет аккаунта ?",
        signUp: "Зарегистрироваться",
        emailPlaceholder: "xxxxxxxxxx"
      }
    }
  },
  tr: {
    translation: {
      common: {
        dashboard: "Kontrol Paneli",
        patientsList: "Hasta Listesi",
        therapySessions: "Terapi Seansları",
        startNextSession: "Sonraki Seansı Başlat",
        searchPlaceholder: "Hasta, seans ara...",
        helpCenter: "Destek Merkezi",
        logout: "Çıkış Yap"
      },
      dashboard: {
        goodMorning: "Günaydın, {{name}}",
        clinicalOverview: "Bugün için klinik özetiniz.",
        todaysSessions: "Bugünkü Seanslar",
        moreThanYesterday: "dünden 2 fazla",
        weeklySessions: "Haftalık Seanslar",
        moreThanLastWeek: "geçen haftadan 4 fazla",
        monthlySessions: "Aylık Seanslar",
        moreThanLastMonth: "geçen aydan 10 fazla",
        publishedBlogs: "Yayınlanan Bloglar",
        readLatestBlogs: "En son klinik yazıları oku",
        currentDateTime: "Geçerli Tarih ve Saat",
        todaysSchedule: "Bugünkü Program",
        viewFullCalendar: "Tam Takvimi Görüntüle",
        completed: "Tamamlandı",
        sessionActive: "Seans Aktif",
        waiting: "Bekliyor",
        endSession: "Seansı Bitir",
        joinRoom: "Odaya Katıl",
        reviewFile: "Dosyayı İncele",
        activePatients: "Aktif Hastalar",
        lastSession: "son seans: {{time}}",
        highPriority: "yüksek öncelikli",
        nextTomorrow: "sonraki: yarın",
        viewAllPatients: "Tüm Hastaları Görüntüle",
        blogsNotification: "En son klinik makaleler ve blog dizini açılıyor...",
        personalNotes: "Kişisel Notlar",
        addNotePlaceholder: "Hızlıca bir not ekle...",
        clearAllNotes: "Tüm Notları Temizle"
      },
      patients: {
        directory: "Hasta Dizini",
        subtitle: "Aktif hastalarınızı, teşhis etiketlerini ve klinik ruh hali metriklerini yönetin ve izleyin.",
        addPatient: "Hasta Ekle",
        totalCaseActive: "Toplam Aktif Vaka",
        highPriority: "Yüksek Öncelik",
        needNotesToday: "Bugün Not Gerekenler",
        completedWeekly: "Haftalık Tamamlanan",
        searchBarPlaceholder: "İsim veya teşhise göre ara...",
        priorityLabel: "Öncelik:",
        allCaseload: "Tüm Hastalar",
        highPriorityFilter: "Yüksek Öncelik",
        mediumPriority: "Orta Öncelik",
        normalPriority: "Normal Öncelik",
        viewProfile: "Profili Görüntüle",
        moodIndicator: "Ruh Hali Göstergesi",
        lastSessionLabel: "Son Seans",
        nextSessionLabel: "Sonraki Seans",
        noPatients: "Arama kriterlerinize uyan hasta bulunamadı.",
        clearFilters: "Filtreleri temizlemeyi veya yazımı kontrol etmeyi deneyin."
      },
      sessions: {
        directory: "Terapi Seansları",
        subtitle: "Randevuları inceleyin, takvimleri senkronize edin, sanal teletıp kliniklerine katılın ve SOAP özet günlüklerini doldurun.",
        todayLoad: "Bugünkü Seanslar",
        weekLoad: "Bu Haftanın Yükü",
        monthLoad: "Aylık Toplam",
        todayTab: "Bugün",
        weekTab: "Bu Hafta",
        monthTab: "Bu Ay",
        joinRoom: "Odaya Katıl",
        reviewSummary: "Özeti İncele",
        details: "Detaylar",
        noSessions: "Bu tarih aralığında planlanmış seans bulunmamaktadır."
      },
      nav: {
        seoManagement: "SEO"
      },
      auth: {
        signIn: "Giriş yap",
        emailLabel: "E-posta",
        passwordLabel: "Şifre",
        passwordPlaceholder: "En az 8 karakter",
        forgotPassword: "ŞİFREMİ UNUTTUNUZ MU ?",
        noAccount: "Hesabınız yok mu ?",
        signUp: "Kayıt ol",
        emailPlaceholder: "xxxxxxxxxx"
      }
    }
  }
}

const savedLang = localStorage.getItem('nexusmind-lang') || 'az'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
