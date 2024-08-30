export type SendEmailDto = {
  from?: string;
  recipients?: string;
  subject: string;
  text?: string;
  html: string;
  placeholderReplacement?: Record<string, string>;
};
