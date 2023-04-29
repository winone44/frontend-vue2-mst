<?php

// Sprawdzenie, czy plik został przesłany
if (!isset($_FILES['file'])) {
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'message' => 'Nie przesłano pliku']);
  exit();
}

$file = $_FILES['file'];

// Sprawdzenie, czy plik nie jest zbyt duży
$maxFileSize = 1024 * 1024 * 40; // 40 MB
if ($file['size'] > $maxFileSize) {
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'message' => 'Plik jest zbyt duży']);
  exit();
}

// Przesunięcie pliku z tymczasowego katalogu do docelowego
$destination = __DIR__ . '/media/' . $file['name'];
if (!move_uploaded_file($file['tmp_name'], $destination)) {
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'message' => 'Wystąpił błąd podczas zapisywania pliku']);
  exit();
}

header('Content-Type: application/json');
echo json_encode(['success' => true]);