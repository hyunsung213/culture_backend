import { NextFunction, Request, Response } from "express";
import {
  getTodayWord,
  getWordDetail,
  getWords,
  getWordSummaries
} from "../services/word.service";

export const getTodayWordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const word = await getTodayWord(req.user?.id ?? null);
    res.json(word);
  } catch (error) {
    next(error);
  }
};

export const getWordsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const words = await getWords();
    res.json(words);
  } catch (error) {
    next(error);
  }
};

export const getWordSummariesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const words = await getWordSummaries();
    res.json(words);
  } catch (error) {
    next(error);
  }
};

export const getWordDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const word = await getWordDetail(req.params.wordId);
    res.json(word);
  } catch (error) {
    next(error);
  }
};
