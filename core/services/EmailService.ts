import { Resend } from "resend";
import { Issue } from "@prisma/client";

// Email Service class for Resend integration
export class EmailService {
    private resend: Resend;
    private fromEmail: string;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
    }

    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: "Welcome to ApniSec - Your Cybersecurity Partner",
                html: this.getWelcomeEmailTemplate(name),
            });
        } catch (error) {
            console.error("Failed to send welcome email:", error);
            // Don't throw error - email failure shouldn't block registration
        }
    }

    async sendIssueCreatedEmail(
        email: string,
        name: string,
        issue: Issue
    ): Promise<void> {
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: `New Security Issue Created: ${issue.title}`,
                html: this.getIssueCreatedTemplate(name, issue),
            });
        } catch (error) {
            console.error("Failed to send issue created email:", error);
        }
    }

    async sendProfileUpdatedEmail(email: string, name: string): Promise<void> {
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: "Profile Updated Successfully - ApniSec",
                html: this.getProfileUpdatedTemplate(name),
            });
        } catch (error) {
            console.error("Failed to send profile updated email:", error);
        }
    }

    private getWelcomeEmailTemplate(name: string): string {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              background-color: #f4f4f4;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px; 
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content { padding: 30px; }
            .footer { 
              text-align: center; 
              padding: 20px; 
              color: #666; 
              font-size: 12px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ApniSec! 🛡️</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Thank you for joining ApniSec, your trusted cybersecurity partner!</p>
              <p>Your account has been successfully created. You now have access to:</p>
              <ul>
                <li>🔒 Cloud Security Management</li>
                <li>🎯 Redteam Assessments</li>
                <li>🔍 VAPT (Vulnerability Assessment & Penetration Testing)</li>
              </ul>
              <p>Get started by creating your first security issue and let us help protect your digital assets.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
                Go to Dashboard
              </a>
            </div>
            <div class="footer">
              <p>ApniSec - Securing Your Digital Future</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }

    private getIssueCreatedTemplate(name: string, issue: Issue): string {
        const issueTypeNames: Record<string, string> = {
            CLOUD_SECURITY: "Cloud Security",
            REDTEAM_ASSESSMENT: "Redteam Assessment",
            VAPT: "VAPT (Vulnerability Assessment & Penetration Testing)",
        };

        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              background-color: #f4f4f4;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px; 
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content { padding: 30px; }
            .issue-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
            }
            .footer { 
              text-align: center; 
              padding: 20px; 
              color: #666; 
              font-size: 12px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              margin: 5px 0;
            }
            .badge-${issue.priority.toLowerCase()} {
              background-color: ${issue.priority === "CRITICAL"
                ? "#dc3545"
                : issue.priority === "HIGH"
                    ? "#fd7e14"
                    : issue.priority === "MEDIUM"
                        ? "#ffc107"
                        : "#28a745"
            };
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Security Issue Created 🔔</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your security issue has been successfully created and logged in our system.</p>
              
              <div class="issue-details">
                <h3>📋 Issue Details</h3>
                <p><strong>Type:</strong> ${issueTypeNames[issue.type]}</p>
                <p><strong>Title:</strong> ${issue.title}</p>
                <p><strong>Description:</strong> ${issue.description}</p>
                <p><strong>Priority:</strong> <span class="badge badge-${issue.priority.toLowerCase()}">${issue.priority}</span></p>
                <p><strong>Status:</strong> ${issue.status}</p>
                <p><strong>Created:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
              </div>

              <p>Our security team will review your issue and get back to you shortly.</p>
              <p>You can track the progress of this issue in your dashboard.</p>
            </div>
            <div class="footer">
              <p>ApniSec - Securing Your Digital Future</p>
              <p>Issue ID: ${issue.id}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }

    private getProfileUpdatedTemplate(name: string): string {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              background-color: #f4f4f4;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 30px; 
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content { padding: 30px; }
            .footer { 
              text-align: center; 
              padding: 20px; 
              color: #666; 
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Profile Updated ✅</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your profile has been successfully updated.</p>
              <p>If you did not make this change, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>ApniSec - Securing Your Digital Future</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
}
