// components/features/case/CaseSummaryPDF.tsx

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#0057FF', // Use your primary color
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1px solid #CCC',
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    color: '#343a40', // Muted text color
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
});

export default function CaseSummaryPDF({ caseTitle, summary, clientName }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Case Summary</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Case Details</Text>
          <Text style={styles.text}>**Case Title:** {caseTitle}</Text>
          <Text style={styles.text}>**Client Name:** {clientName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Case Overview</Text>
          <Text style={styles.text}>{summary}</Text>
        </View>
      </Page>
    </Document>
  );
}
