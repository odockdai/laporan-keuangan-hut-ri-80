# KEDEMPEL - Laporan Keuangan HUT RI-80

A modern, minimalist financial report application built with Next.js for tracking income and expenses during Indonesia's 80th Independence Day celebration.

## Features

- **Real-time Data**: Fetches transaction data from Google Sheets
- **Modern UI/UX**: Clean, minimalist design with dark/light mode support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Transaction Details**: Click on any transaction to view full description and receipt images
- **Financial Summary**: Real-time balance calculation and display
- **Indonesian Formatting**: Proper rupiah currency formatting (Rp100.000)

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Source**: Google Sheets (via CSV export)
- **Data Parsing**: PapaParse for CSV processing
- **Image Handling**: Next.js Image component with remote pattern support

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and design system
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page with transaction table
│   └── keterangan/[id]/     # Transaction detail pages
├── components/
│   ├── Header.tsx           # Header with title and balance summary
│   ├── TransactionTable.tsx # Main transaction table component
│   └── Footer.tsx           # Footer component
└── lib/
    └── data.ts              # Data fetching and processing logic
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Data Source Configuration

The application fetches data from a Google Sheets document. To use your own data source:

1. Create a Google Sheets document with the following columns:
   - `id`: Unique transaction identifier
   - `date`: Transaction date (YYYY-MM-DD format)
   - `description`: Short transaction description
   - `income`: Income amount (number)
   - `expense`: Expense amount (number)
   - `fullDescription`: Detailed transaction description
   - `imageUrl`: URL to receipt/proof image (optional)

2. Make the sheet publicly accessible and get the CSV export URL

3. Update the `GOOGLE_SHEET_URL` in `src/lib/data.ts`

## Design System

### Colors
- **Light Mode**: Clean whites and grays with blue accents
- **Dark Mode**: Dark slate backgrounds with proper contrast
- **Financial Colors**: Green for income, red for expenses

### Typography
- **System Fonts**: Uses native system fonts for optimal performance
- **Hierarchy**: Clear typographic scale with proper spacing
- **Monospace**: Used for numbers and dates for better alignment

### Layout
- **Card-based Design**: Clean cards with subtle shadows
- **Responsive Grid**: Adapts to all screen sizes
- **Consistent Spacing**: 8px spacing system throughout

## Features in Detail

### Transaction Table
- Displays all transactions in a clean, sortable table
- Shows date, description, income, expense, and running balance
- Click on any transaction description to view details
- Responsive design with horizontal scroll on mobile

### Transaction Details
- Full transaction description
- Receipt/proof images when available
- Clean, focused layout for easy reading
- Back navigation to main table

### Balance Calculation
- Real-time balance calculation
- Color-coded positive/negative balances
- Displayed prominently in header

## Build and Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support or questions, please contact the development team.

---

**Built with ❤️ for HUT RI ke-80**