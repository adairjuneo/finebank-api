import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const main: React.CSSProperties = {
  backgroundColor: '#F4F5F7',
  padding: '10px 0',
  fontFamily: 'Inter, Open Sans, Arial',
};

const container: React.CSSProperties = {
  border: '1px solid #D0D5DD',
  borderRadius: '4px',
  padding: '45px',
};

const head: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
};

const button: React.CSSProperties = {
  backgroundColor: '#299D91',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 12px',
  fontWeight: 'bold',
};

const text = {
  fontSize: '16px',
  fontWeight: '300',
  color: '#666666',
  lineHeight: '26px',
};

export default function RecoveryPassword() {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Recovery your password - Finebank.io</Preview>
        <Container style={container}>
          <Section style={head}>
            <Img
              src={logoImage64}
              width={276}
              height={32}
              alt="finebank.io logo"
            />
          </Section>

          <Section>
            <Row>
              <Heading
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Recovery Your Password
              </Heading>
            </Row>

            <Section>
              <Text style={{ fontSize: 18, color: '#666666' }}>
                Hi USER-PROFILE-NAME,
              </Text>
              <Text style={text}>
                Someone recently requested a password change for your Finebank
                account. If this was you, you can set a new password here:
              </Text>
              <Button style={button} href="https://www.google.com.br">
                Reset password
              </Button>
              <Text style={text}>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
            </Section>

            <Link
              style={{
                fontSize: '16px',
                color: '#878787',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
              href="https://www.google.com.br"
            >
              Back to finebank.io
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const logoImage64 =
  'data:image/png;base64, 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';
