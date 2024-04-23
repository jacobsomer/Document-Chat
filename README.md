# Chatboba

Chatboba is an open source project that enables users to engage in chat discussions centered around documents. Built using React, Next.js, and Supabase, this platform integrates real-time chat functionalities with document management, providing a seamless user experience.

## Features

- **Real-Time Chat**: Users can instantly send and receive messages.
- **Document-Centric Discussions**: Each chat can be associated with specific documents to enable focused discussions.
- **Authentication**: Integrated with Supabase Auth to ensure secure access to user-specific chats.
- **Responsive Design**: A fully responsive web interface compatible with various devices.

## Technology Stack

- **Frontend**: React, Next.js
- **Backend**: Supabase (for database and authentication)
- **State Management**: React Hooks
- **Routing**: Next Router

## Getting Started

### Prerequisites

- Node.js
- A Supabase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/jacobsomer/Chatboba.git
cd Chatboba
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file at the root of your project and fill in the following variables according to your Supabase setup:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL_DEV=your_supabase_url_for_dev
NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV=your_supabase_anon_key_for_dev
```

4. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to see the application in action.

## How to Contribute

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Jacob Somer - [@jacob_somer_](https://twitter.com/jacob_somer_) - jsomer@cmu.edu

Project Link: [https://github.com/jacobsomer/Chatboba](https://github.com/jacobsomer/Chatboba)


