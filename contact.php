<?php
/**
 * ============================================
 * ESSY'S CROCHET SHOP — Contact Form Handler
 * File: contact.php
 *
 * What this file does:
 *  1. Receives POST data from contact.html
 *  2. Sanitises and validates all inputs
 *  3. Sends an email notification to the shop owner
 *  4. Redirects back to contact.html with a
 *     success or error status in the URL
 *
 * HOW TO USE:
 *  - Upload all files to a PHP-enabled web server
 *    (e.g. cPanel, Namecheap, Hostinger, or localhost with XAMPP/MAMP)
 *  - Update the $owner_email variable below with the real shop email
 *  - The form in contact.html already points to this file (action="contact.php")
 * ============================================
 */

// =============================================
// CONFIGURATION — Update these before going live
// =============================================
$owner_email   = 'hello@essyscrochet.co.ke'; // Where form submissions will be sent
$shop_name     = "Essy's Crochet Shop";
$redirect_page = 'contact.html';             // Page to redirect to after submission


// =============================================
// SECURITY: Only allow POST requests
// =============================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // If someone visits this file directly via GET, send them back
    header('Location: ' . $redirect_page);
    exit;
}


// =============================================
// STEP 1: Collect & Sanitise Input
// PHP's filter_input and htmlspecialchars help
// prevent XSS (cross-site scripting) attacks.
// =============================================

// filter_input(INPUT_POST, 'field', FILTER_SANITIZE_SPECIAL_CHARS) strips HTML tags
$name    = trim(filter_input(INPUT_POST, 'name',    FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$email   = trim(filter_input(INPUT_POST, 'email',   FILTER_SANITIZE_EMAIL)         ?? '');
$phone   = trim(filter_input(INPUT_POST, 'phone',   FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$subject = trim(filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$message = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');

// Map the subject dropdown value to a readable label
$subject_labels = [
    'general'   => 'General Enquiry',
    'order'     => 'Custom Order',
    'wholesale' => 'Wholesale / Bulk Order',
    'collab'    => 'Collaboration / Feature',
    'other'     => 'Other',
];
$subject_label = isset($subject_labels[$subject]) ? $subject_labels[$subject] : 'General Enquiry';


// =============================================
// STEP 2: Server-Side Validation
// Even though we validate in JavaScript, we
// always validate on the server too — JS can
// be bypassed by users.
// =============================================
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Please enter a message of at least 10 characters.';
}

// If there are validation errors, redirect with an error status
if (!empty($errors)) {
    header('Location: ' . $redirect_page . '?status=error&reason=validation');
    exit;
}


// =============================================
// STEP 3: Build the Email
// We compose a plain-text email with all the
// submitted form details.
// =============================================

// Email subject line
$email_subject = "[{$shop_name}] New Contact: {$subject_label} from {$name}";

// Email body — formatted for readability
$email_body  = "You have received a new message via your website contact form.\n";
$email_body .= str_repeat('-', 55) . "\n\n";
$email_body .= "NAME:     {$name}\n";
$email_body .= "EMAIL:    {$email}\n";
$email_body .= "PHONE:    " . (!empty($phone) ? $phone : 'Not provided') . "\n";
$email_body .= "SUBJECT:  {$subject_label}\n\n";
$email_body .= "MESSAGE:\n{$message}\n\n";
$email_body .= str_repeat('-', 55) . "\n";
$email_body .= "Sent from the contact form on {$shop_name}'s website.\n";
$email_body .= "Reply directly to this email to respond to {$name}.\n";

// Email headers — setting the From and Reply-To makes it easy to reply
$headers  = "From: {$shop_name} <noreply@essyscrochet.co.ke>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();


// =============================================
// STEP 4: Send the Email
// PHP's built-in mail() function sends the email.
// NOTE: For production sites, use a library like
// PHPMailer with SMTP (e.g. Gmail or SendGrid)
// for more reliable delivery.
// =============================================
$mail_sent = mail($owner_email, $email_subject, $email_body, $headers);


// =============================================
// STEP 5: Send a Thank-You Auto-Reply to the Sender
// A nice touch — the customer gets a confirmation email.
// =============================================
if ($mail_sent) {
    $reply_subject = "Thanks for reaching out — " . $shop_name;
    $reply_body    = "Hi {$name},\n\n";
    $reply_body   .= "Thank you so much for getting in touch! 🧶\n\n";
    $reply_body   .= "I've received your message and will get back to you within 24 hours.\n\n";
    $reply_body   .= "Here's a copy of what you sent me:\n";
    $reply_body   .= str_repeat('-', 40) . "\n";
    $reply_body   .= "{$message}\n";
    $reply_body   .= str_repeat('-', 40) . "\n\n";
    $reply_body   .= "While you wait, feel free to browse the gallery at:\n";
    $reply_body   .= "https://essyscrochet.co.ke/gallery.html\n\n";
    $reply_body   .= "Warm stitches,\nEssy 🌸\n";
    $reply_body   .= $shop_name . "\nhello@essyscrochet.co.ke\n";

    $reply_headers  = "From: {$shop_name} <hello@essyscrochet.co.ke>\r\n";
    $reply_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // We send this but don't check if it succeeds — the main email is the priority
    @mail($email, $reply_subject, $reply_body, $reply_headers);
}


// =============================================
// STEP 6: Redirect with Result Status
// We redirect back to the contact page with a
// ?status= parameter in the URL. JavaScript on
// contact.html reads this and shows a message.
// =============================================
if ($mail_sent) {
    // SUCCESS — email was sent
    header('Location: ' . $redirect_page . '?status=success&name=' . urlencode($name));
} else {
    // ERROR — mail() failed (e.g. server not configured for email)
    header('Location: ' . $redirect_page . '?status=error&reason=mail');
}

exit; // Always exit after a redirect
?>
