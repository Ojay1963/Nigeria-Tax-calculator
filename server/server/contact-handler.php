<?php
// contact-handler.php
// Basic secure-ish form handler — update $to to a real email address before use.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: contact.html');
  exit;
}

// Simple sanitization
$name = trim(filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING));
$email = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$message = trim(filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING));

if (!$name || !$email || !$message) {
  echo "<script>alert('Please fill in all fields.'); window.location='contact.html';</script>";
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo "<script>alert('Please enter a valid email address.'); window.location='contact.html';</script>";
  exit;
}

// CHANGE THIS to your real destination email
$to = "your-email@example.com";
$subject = "Contact form message from Tax Tools NG site";
$body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
$headers = "From: $name <$email>\r\nReply-To: $email\r\n";

// Try to send
if (mail($to, $subject, $body, $headers)) {
  echo "<script>alert('Thank you — your message has been sent.'); window.location='contact.html';</script>";
  exit;
} else {
  echo "<script>alert('Sorry — message could not be sent. Please try again later.'); window.location='contact.html';</script>";
  exit;
}
?>
